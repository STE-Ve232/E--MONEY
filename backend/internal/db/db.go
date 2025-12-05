import (
"emoney/internal/config"
"emoney/internal/models"
"gorm.io/driver/postgres"
"gorm.io/gorm"
)


var DB *gorm.DB


func Connect(cfg *config.Config) error {
dsn := cfg.DATABASE_URL
db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
if err != nil { return err }
DB = db
// Auto migrate
return DB.AutoMigrate(
&models.User{}, &models.Account{}, &models.LedgerEntry{}, &models.PayoutInstruction{}, &models.AuditLog{}, &models.DeviceBinding{}, &models.BlacklistedToken{}, &models.KYCDocument{},
)
}