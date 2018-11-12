using System.Web;
using System.Web.Mvc;

namespace poc_vue_webpack_aspnet461
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
