using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace MOM_PROJECT.Filters
{
    /// <summary>
    /// Global action filter that:
    ///   1. Lets [AllowAnonymous] actions pass through untouched.
    ///   2. Lets Admin controller routes pass through (AdminOnly filter handles them).
    ///   3. Redirects unauthenticated users to Member Login.
    ///   4. Redirects Admin-role users away from Member routes to Admin Dashboard.
    /// </summary>
    public class CheckAccess : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            // ── 1. Skip if [AllowAnonymous] ──
            if (context.ActionDescriptor.EndpointMetadata
                    .Any(em => em.GetType() == typeof(Microsoft.AspNetCore.Authorization.AllowAnonymousAttribute)))
            {
                base.OnActionExecuting(context);
                return;
            }

            var session    = context.HttpContext.Session;
            var controller = context.RouteData.Values["controller"]?.ToString() ?? "";

            // ── 2. Admin controller is entirely handled by [AdminOnly] – skip here ──
            if (string.Equals(controller, "Admin", StringComparison.OrdinalIgnoreCase))
            {
                base.OnActionExecuting(context);
                return;
            }

            var userId = session.GetString("UserID");

            // ── 3. Not logged in at all → Member Login ──
            if (string.IsNullOrEmpty(userId))
            {
                context.Result = new RedirectToActionResult("Login", "Account", null);
                return;
            }

            // ── 4. Admin user trying to use Member routes → Admin Dashboard ──
            var role = session.GetString("UserRole") ?? "";
            if (string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase))
            {
                context.Result = new RedirectToActionResult("AdminDashboard", "Admin", null);
                return;
            }

            base.OnActionExecuting(context);
        }
    }
}
