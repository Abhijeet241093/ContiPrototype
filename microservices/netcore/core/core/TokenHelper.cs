using Microsoft.IdentityModel.Tokens;
using System.Text;


namespace TokenHelper
{
    public static class JwtSecurityKey
    {
        public static SymmetricSecurityKey Create(string secret)
        {
            var value = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
            return value;
        }
    }
}
