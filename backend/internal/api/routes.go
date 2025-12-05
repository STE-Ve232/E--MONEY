import (
"github.com/gofiber/fiber/v2"
"emoney/internal/config"
"emoney/internal/api/handlers"
)


func RegisterRoutes(app *fiber.App, cfg *config.Config) {
v1 := app.Group("/api")
v1.Post("/auth/register", handlers.Register)
v1.Post("/auth/login", handlers.Login)
v1.Post("/auth/refresh", handlers.Refresh)
v1.Post("/auth/logout", handlers.Logout)


v1.Post("/2fa/setup", handlers.Setup2FA)
v1.Post("/2fa/enable", handlers.Enable2FA)
v1.Post("/2fa/disable", handlers.Disable2FA)


v1.Post("/ledger/transfer", handlers.Transfer)
v1.Get("/accounts/:id/balance", handlers.GetBalance)


v1.Post("/payouts/create", handlers.CreatePayout)
v1.Post("/payouts/webhook", handlers.PayoutWebhook)


v1.Get("/admin/analytics", ha