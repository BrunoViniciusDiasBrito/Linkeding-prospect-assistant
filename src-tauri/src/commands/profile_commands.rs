use crate::repositories::{CreateProfilePayload, Profile, ProfileRepository, UpdateProfilePayload};

#[tauri::command]
pub fn create_profile(payload: CreateProfilePayload) -> Result<Profile, String> {
    ProfileRepository::create(payload).map_err(|error| error.to_string())
}

#[tauri::command]
pub fn list_profiles(search_id: Option<String>) -> Result<Vec<Profile>, String> {
    ProfileRepository::list(search_id).map_err(|error| error.to_string())
}

#[tauri::command]
pub fn update_profile(id: String, payload: UpdateProfilePayload) -> Result<Profile, String> {
    ProfileRepository::update(&id, payload).map_err(|error| error.to_string())
}

#[tauri::command]
pub fn delete_profile(id: String) -> Result<(), String> {
    ProfileRepository::delete(&id).map_err(|error| error.to_string())
}
