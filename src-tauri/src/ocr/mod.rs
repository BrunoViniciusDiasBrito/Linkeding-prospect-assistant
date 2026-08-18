use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BadgeConfig {
    pub label: String,
    pub aliases: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DetectedBadge {
    pub label: String,
    pub matched_text: String,
}

pub fn detect_badges_from_text(text: &str, badges: &[BadgeConfig]) -> Vec<DetectedBadge> {
    let normalized = text.to_lowercase();
    badges.iter().filter_map(|badge| {
        std::iter::once(&badge.label).chain(badge.aliases.iter()).find(|alias| normalized.contains(&alias.to_lowercase())).map(|matched| DetectedBadge { label: badge.label.clone(), matched_text: matched.clone() })
    }).collect()
}

#[tauri::command]
pub fn detect_configured_badges(text: String, badges: Vec<BadgeConfig>) -> Vec<DetectedBadge> {
    detect_badges_from_text(&text, &badges)
}
