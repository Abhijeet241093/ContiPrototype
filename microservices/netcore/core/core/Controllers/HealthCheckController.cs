using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Entities;
using System.Threading.Tasks;
using Services;

namespace Controllers
{
    //[Authorize]
    [Route("healthcheck")]
    [ApiController]
    public class HealthCheckController : ControllerBase
    {

        [HttpGet]
        public async Task<IActionResult> Detection()
        {
            var result = new ServiceResult<string>(true, "Ok", "");
            return Ok(result);
        }
    }
}
