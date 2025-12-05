package config


import (
"github.com/joho/godotenv"
"os"
)


type Config struct {
HTTP_ADDR string
DATABASE_URL string
REDIS_URL string
JWT_SECRET string
JWT_ACCESS_EXP int // seconds
JWT_REFRESH_EXP int
FLUTTERWAVE_SECRET string
PAYSTACK_SECRET string
CELLULANT_SECRET string
RESERVE_ACCOUNT_EMC uint64
}


func LoadConfig() *Config {
godotenv.Load()
return &Config{
HTTP_ADDR: getEnv("HTTP_ADDR", ":8080"),
DATABASE_URL: getEnv("DATABASE_URL", "postgres://emc:emcpass@postgres:5432/emoney?sslmode=disable"),
REDIS_URL: getEnv("REDIS_URL", "redis:6379"),
JWT_SECRET: getEnv("JWT_SECRET", "CHANGE_ME_JWT"),
JWT_ACCESS_EXP: atoiDefault(getEnv("JWT_ACCESS_EXP","900"),900),
JWT_REFRESH_EXP: atoiDefault(getEnv("JWT_REFRESH_EXP","1209600"),1209600),
FLUTTERWAVE_SECRET: getEnv("FLUTTERWAVE_SECRET","CHANGE_ME_FW"),
PAYSTACK_SECRET: getEnv("PAYSTACK_SECRET","CHANGE_ME_PS"),
CELLULANT_SECRET: getEnv("CELLULANT_SECRET","CHANGE_ME_CELL"),
RESERVE_ACCOUNT_EMC: uint64(atoiDefault(getEnv("RESERVE_ACCOUNT_EMC","1"),1)),
}
}


func getEnv(k, d string) string { if v := os.Getenv(k); v != "" { return v } ; return d }
func atoiDefault(s string, d int) int { v := d; if n, err := strconv.Atoi(s); err==nil { v = n }; return v }