using System;
using System.IO;
using Amazon.S3;
using Microsoft.AspNetCore.Http;
using Amazon;
using Entities;

namespace Services
{
    public class DetectionServices : IDetectionServices
    {
        private readonly IAws3Services _aws3Services;

        public DetectionServices()
        {
            _aws3Services = new Aws3Services("AKIAZQ2GD4AJWOTFTW4N", "sOGFCYtl72FQxhATA13eQ+6sswC6WW6dgVl86V3n", RegionEndpoint.APNortheast2, "chungangdemo");
        }

        public string GetPublicUrl(string key)
        {
            try
            {
                var response = _aws3Services.GetPublicUrl(key);
                return response;
            }
            catch (Exception ex)
            {
                return null;
            }

        }
        public async Task<ServiceResult<string>> ObjectDetection(string key)
        {
            try
            {
                var response = GetPublicUrl(key);
                return new ServiceResult<string>(true, response, String.Empty);
            }
            catch (Exception ex)
            {
                return new ServiceResult<string>(false, null, ex.Message);
            }
        }
    }
}
