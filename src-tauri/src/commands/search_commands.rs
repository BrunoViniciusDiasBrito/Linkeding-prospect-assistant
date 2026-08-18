use crate::repositories::{CreateSearchPayload, Search, SearchRepository, UpdateSearchPayload};

#[tauri::command]
pub fn create_search(payload: CreateSearchPayload) -> Result<Search, String> {
    SearchRepository::create(payload).map_err(|error| error.to_string())
}

#[tauri::command]
pub fn list_searches() -> Result<Vec<Search>, String> {
    SearchRepository::list().map_err(|error| error.to_string())
}

#[tauri::command]
pub fn update_search(id: String, payload: UpdateSearchPayload) -> Result<Search, String> {
    SearchRepository::update(&id, payload).map_err(|error| error.to_string())
}

#[tauri::command]
pub fn delete_search(id: String) -> Result<(), String> {
    SearchRepository::delete(&id).map_err(|error| error.to_string())
}
