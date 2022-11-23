using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Microsoft.AspNetCore.Http;

namespace Services
{
	public class Aws3Services : IAws3Services
	{
		private readonly string _bucketName;
		private readonly IAmazonS3 _awsS3Client;

		public Aws3Services(string awsAccessKeyId, string awsSecretAccessKey, RegionEndpoint region, string bucketName)
		{
			_bucketName = bucketName;
			_awsS3Client = new AmazonS3Client(awsAccessKeyId, awsSecretAccessKey, region);
		}
		public string GetPublicUrl(string key)
		{
			try
			{
				string keyLocal = key;
				GetPreSignedUrlRequest getPreSignedUrlRequest = new GetPreSignedUrlRequest
				{
					BucketName = _bucketName,
					Key = keyLocal,
					Expires = DateTime.UtcNow.AddHours(2),
					Verb = HttpVerb.GET
				};
				string response = _awsS3Client.GetPreSignedURL(getPreSignedUrlRequest);
				return response;
			}
			catch (Exception ex)
			{
				throw;
			}
		}
	}
}
