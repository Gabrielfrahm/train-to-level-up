
output "ec2_instance_profile" {
  value = aws_iam_instance_profile.ec2-profile.name
}
