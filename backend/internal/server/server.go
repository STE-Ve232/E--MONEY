package server


import (
"emoney/internal/config"
"emoney/internal/db"
"emoney/internal/api"
"github.com/gofiber/fiber/v2"
"github.com/gofiber/fiber/v2/middleware/logger"
"github.com/gofiber/fiber/v2/middleware/requestid"
"github.com/gofiber/fiber/v2/middleware/limiter"
"time"
)


func NewServer(cfg *config.Config) (*fiber.App, error) {
if err := db.Connect(cfg); err != nil { return nil, err }
app := fiber.New()
app.Use(requestid.New())
app.Use(logger.New())
app.Use(limiter.New(limiter.Config{Max: 200, Expiration: 60 * time.Minute}))


api.RegisterRoutes(app, cfg)
return app, nil
}