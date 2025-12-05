package models
ID uint64 `gorm:"primaryKey"`
TxRef string `gorm:"uniqueIndex;size:128"`
Provider string
ProviderRef string
AccountID uint64
Destination datatypes.JSONMap `gorm:"type:jsonb"`
Amount float64 `gorm:"type:numeric(20,6)"`
Currency string `gorm:"size:8"`
Status string `gorm:"size:32"` // pending,in_progress,completed,failed
Attempts int
LastError string
Metadata datatypes.JSONMap `gorm:"type:jsonb"`
CreatedAt time.Time
UpdatedAt time.Time
}


type AuditLog struct {
ID uint64 `gorm:"primaryKey"`
EventType string `gorm:"size:128;index"`
ActorUserID *uint64
Target string
Severity string
Details datatypes.JSONMap `gorm:"type:jsonb"`
CreatedAt time.Time
}


type DeviceBinding struct {
ID uint64 `gorm:"primaryKey"`
UserID uint64 `gorm:"index"`
DeviceID string `gorm:"index;size:128"`
CreatedAt time.Time
}


type BlacklistedToken struct {
ID uint64 `gorm:"primaryKey"`
Jti string `gorm:"uniqueIndex;size:128"`
CreatedAt time.Time
}


type KYCDocument struct {
ID uint64 `gorm:"primaryKey"`
UserID uint64
DocumentType string
StorageRef string
Status string
CreatedAt time.Time
}