using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace MOM_PROJECT.Filters
{
    /// <summary>
    /// Action filter that restricts access to Admin-role users only.
    /// If the session role is not "Admin" → redirect to Account/Login.
    /// </summary>
    public class AdminOnly : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var role   = context.HttpContext.Session.GetString("UserRole");
            var userId = context.HttpContext.Session.GetString("UserID");

            // Not logged in at all
            if (string.IsNullOrEmpty(userId))
            {
                context.Result = new RedirectToActionResult("AdminLogin", "Admin", null);
                return;
            }

            // Logged in but not an admin
            if (!string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase))
            {
                context.Result = new RedirectToActionResult("AccessDenied", "Admin", null);
                return;
            }

            base.OnActionExecuting(context);
        }
    }
}
