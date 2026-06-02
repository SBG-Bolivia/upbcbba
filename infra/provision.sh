#!/usr/bin/env bash
# Provision the AWS certificate backend (DynamoDB tables, S3 bucket, SES sender).
# Idempotent-ish: re-running will error on already-existing resources — that's fine.
#
# Usage:
#   export AWS_REGION=us-east-1
#   export SBG_S3_BUCKET=sbg-cert-<your-unique-suffix>
#   export SBG_SES_SENDER=certificados@yourdomain.com
#   bash infra/provision.sh
set -euo pipefail

: "${AWS_REGION:?set AWS_REGION}"
: "${SBG_S3_BUCKET:?set SBG_S3_BUCKET (must be globally unique, start with sbg-cert-)}"
: "${SBG_SES_SENDER:?set SBG_SES_SENDER}"

echo "Region: $AWS_REGION | Bucket: $SBG_S3_BUCKET | Sender: $SBG_SES_SENDER"
echo

echo "==> DynamoDB: events"
aws dynamodb create-table --region "$AWS_REGION" \
  --table-name sbg-cert-events \
  --billing-mode PAY_PER_REQUEST \
  --attribute-definitions AttributeName=eventId,AttributeType=S \
  --key-schema AttributeName=eventId,KeyType=HASH

echo "==> DynamoDB: participants (+ email GSI)"
aws dynamodb create-table --region "$AWS_REGION" \
  --table-name sbg-cert-participants \
  --billing-mode PAY_PER_REQUEST \
  --attribute-definitions AttributeName=participantId,AttributeType=S AttributeName=email,AttributeType=S \
  --key-schema AttributeName=participantId,KeyType=HASH \
  --global-secondary-indexes '[{"IndexName":"email-index","KeySchema":[{"AttributeName":"email","KeyType":"HASH"}],"Projection":{"ProjectionType":"ALL"}}]'

echo "==> DynamoDB: attendance (composite key)"
aws dynamodb create-table --region "$AWS_REGION" \
  --table-name sbg-cert-attendance \
  --billing-mode PAY_PER_REQUEST \
  --attribute-definitions AttributeName=eventId,AttributeType=S AttributeName=participantId,AttributeType=S \
  --key-schema AttributeName=eventId,KeyType=HASH AttributeName=participantId,KeyType=RANGE

echo "==> DynamoDB: certificates (+ eventId GSI)"
aws dynamodb create-table --region "$AWS_REGION" \
  --table-name sbg-cert-certificates \
  --billing-mode PAY_PER_REQUEST \
  --attribute-definitions AttributeName=certId,AttributeType=S AttributeName=eventId,AttributeType=S \
  --key-schema AttributeName=certId,KeyType=HASH \
  --global-secondary-indexes '[{"IndexName":"eventId-index","KeySchema":[{"AttributeName":"eventId","KeyType":"HASH"}],"Projection":{"ProjectionType":"ALL"}}]'

echo "==> S3 bucket (private)"
if [ "$AWS_REGION" = "us-east-1" ]; then
  aws s3api create-bucket --bucket "$SBG_S3_BUCKET" --region us-east-1
else
  aws s3api create-bucket --bucket "$SBG_S3_BUCKET" --region "$AWS_REGION" \
    --create-bucket-configuration LocationConstraint="$AWS_REGION"
fi
aws s3api put-public-access-block --bucket "$SBG_S3_BUCKET" \
  --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

echo "==> SES: register sender identity (check your inbox / DNS to verify)"
aws sesv2 create-email-identity --region "$AWS_REGION" --email-identity "$SBG_SES_SENDER" || true

echo
echo "Done. Verify the SES identity, then upload your template:"
echo "  aws s3 cp certificate-template.pdf s3://$SBG_S3_BUCKET/templates/certificate-template.pdf"
