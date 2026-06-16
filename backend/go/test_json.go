package main

import (
	"encoding/json"
	"fmt"
)

type Package struct {
	PricingType   string `json:"pricing_type"`
	TotalSessions *int   `json:"total_sessions"`
}

func main() {
	payload := []byte(`{"pricing_type": "session_based", "total_sessions": "10"}`)
	var pkg Package
	err := json.Unmarshal(payload, &pkg)
	fmt.Printf("Error: %v\nPkg: %+v\n", err, pkg)
}
