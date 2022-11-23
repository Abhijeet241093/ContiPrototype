using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Entities;
using Microsoft.AspNetCore.Http;


namespace Services
{
	public interface IDetectionServices
	{

		Task<ServiceResult<string>> ObjectDetection(string key);
	}
}
