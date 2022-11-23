using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Entities;
using System.Threading.Tasks;
using Services;

namespace Controllers
{
    //[Authorize]
    [Route("api")]
    [ApiController]
    public class DetectionController : ControllerBase
    {

        private readonly IDetectionServices _detectionServices;

        public DetectionController(IDetectionServices detectionServices)
        {
            _detectionServices = detectionServices;
        }
        [HttpGet]
        [Route("detect")]
        public async Task<IActionResult> Detection( string key)
        {
            var id = await _detectionServices.ObjectDetection(key);
            return Ok(id);
        }
    }
}
