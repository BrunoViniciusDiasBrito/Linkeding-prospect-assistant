use crate::ocr::{detect_badges_from_text, BadgeConfig, DetectedBadge};

#[tauri::command]
pub fn detect_profile_badges(visible_text: String, badges: Option<Vec<BadgeConfig>>) -> Vec<DetectedBadge> {
    let defaults = vec![
        BadgeConfig { label: "Open To Work".to_string(), aliases: vec!["open to work".to_string(), "aberto a oportunidades".to_string()] },
        BadgeConfig { label: "Hiring".to_string(), aliases: vec!["hiring".to_string(), "contratando".to_string()] },
    ];
    detect_badges_from_text(&visible_text, badges.as_deref().unwrap_or(&defaults))
}
