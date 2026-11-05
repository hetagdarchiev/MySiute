package main

import (
	"net/url"
	"strings"
)

type Skill struct {
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Items       []string `json:"items"`
}
type Project struct {
	Cover       string   `json:"cover,omitempty"`
	Logo        string   `json:"logo,omitempty"`
	Title       string   `json:"title"`
	Category    string   `json:"category"`
	Description string   `json:"description"`
	Details     string   `json:"details"`
	Tags        []string `json:"tags"`
	URL         string   `json:"url"`
	Demo        string   `json:"demo"`
}
type Content struct {
	Summary  string    `json:"summary"`
	Bio      []string  `json:"bio"`
	Skills   []Skill   `json:"skills"`
	Projects []Project `json:"projects"`
}

func validURL(s string, optional bool) bool {
	if s == "" {
		return optional
	}
	u, e := url.Parse(s)
	return e == nil && u.Host != "" && (u.Scheme == "https" || u.Scheme == "http") && u.User == nil && len(s) <= 2000
}
func bounded(s string, n int) bool { return len([]rune(s)) <= n }
func listValid(a []string, n, max int) bool {
	if a == nil || len(a) > n {
		return false
	}
	for _, s := range a {
		if !bounded(s, max) {
			return false
		}
	}
	return true
}
func (c Content) valid() bool {
	if strings.TrimSpace(c.Summary) == "" || !bounded(c.Summary, 3000) || !listValid(c.Bio, 12, 3000) || c.Skills == nil || len(c.Skills) > 20 || c.Projects == nil || len(c.Projects) > 40 {
		return false
	}
	for _, s := range c.Skills {
		if strings.TrimSpace(s.Title) == "" || !bounded(s.Title, 100) || !bounded(s.Description, 500) || !listValid(s.Items, 40, 100) {
			return false
		}
	}
	for _, p := range c.Projects {
		if strings.TrimSpace(p.Title) == "" || !bounded(p.Title, 100) || !bounded(p.Category, 100) || !bounded(p.Description, 3000) || !bounded(p.Details, 3000) || !listValid(p.Tags, 20, 100) || !validURL(p.URL, false) || !validURL(p.Demo, true) || !validMedia(p.Cover) || !validMedia(p.Logo) {
			return false
		}
	}
	return true
}

func validMedia(s string) bool {
	if s == "" {
		return true
	}
	if !strings.HasPrefix(s, "/api/media/") || len(s) != 75 {
		return false
	}
	for _, c := range strings.TrimPrefix(s, "/api/media/") {
		if !strings.ContainsRune("0123456789abcdef", c) {
			return false
		}
	}
	return true
}
