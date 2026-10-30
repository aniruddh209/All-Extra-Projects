using MOM_PROJECT.Filters;

var builder = WebApplication.CreateBuilder(args);

// =============================
// ADD SERVICES
// =============================

// MVC (Controllers + Views) — with global CheckAccess filter
// This means EVERY page requires login, EXCEPT pages marked [AllowAnonymous]
builder.Services.AddControllersWithViews(options =>
{
    options.Filters.Add(new CheckAccess());
});

// Session — keeps track of who is logged in
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);    // session expires after 30 min idle
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

var app = builder.Build();

// =============================
// MIDDLEWARE PIPELINE
// =============================

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
    app.UseHttpsRedirection(); // Only redirect to HTTPS in production
}

// Static files (CSS, JS, Images)
app.UseStaticFiles();

// Routing
app.UseRouting();

// Session (must be BEFORE Authorization)
app.UseSession();

// =============================
// ROUTES
// =============================

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Account}/{action=Login}/{id?}");

// =============================
// RUN APP
// =============================
app.Run();