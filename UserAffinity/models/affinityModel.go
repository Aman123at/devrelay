package models

type Affinity struct {
	SourceUserID int    `json:"source_user_id"`
	TargetUserID int    `json:"target_user_id"`
	AffinityType string `json:"affinity_type"`
}
