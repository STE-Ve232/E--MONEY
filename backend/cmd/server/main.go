package main


import (
"emoney/internal/config"
"emoney/internal/server"
"log"
)


func main() {
cfg := config.LoadConfig()
app, err := server.NewServer(cfg)
if err != nil {
log.Fatalf("server init error: %v", err)
}
log.Printf("listening on %s", cfg.HTTP_ADDR)
log.Fatal(app.Listen(cfg.HTTP_ADDR))
}