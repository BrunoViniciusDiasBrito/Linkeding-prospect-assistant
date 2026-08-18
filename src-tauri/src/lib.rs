use commands::{profile_commands, search_commands};
mod automation;
mod commands;
mod database;
mod domain;
mod ocr;
mod repositories;
mod services;
mod vision;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            search_commands::create_search,
            search_commands::list_searches,
            search_commands::update_search,
            search_commands::delete_search,
            profile_commands::create_profile,
            profile_commands::list_profiles,
            profile_commands::update_profile,
            profile_commands::delete_profile,
            automation::open_saved_search_url,
            ocr::detect_configured_badges,
            vision::detect_profile_badges,
        ])
        .plugin(tauri_plugin_shell::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
