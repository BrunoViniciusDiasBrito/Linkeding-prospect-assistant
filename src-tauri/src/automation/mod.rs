use tauri::{AppHandle, Manager, WebviewUrl, WebviewWindowBuilder};

fn is_allowed_linkedin_url(url: &str) -> bool {
    url.starts_with("https://www.linkedin.com/") || url.starts_with("https://linkedin.com/")
}

#[tauri::command]
pub fn open_saved_search_url(app: AppHandle, search_id: String, url: String) -> Result<(), String> {
    if !is_allowed_linkedin_url(&url) {
        return Err("only user-saved LinkedIn HTTPS URLs can be opened".to_string());
    }

    let label = format!("linkedin-search-{}", search_id.replace('-', ""));
    if let Some(window) = app.get_webview_window(&label) {
        window.set_focus().map_err(|error| error.to_string())?;
        window.navigate(url.parse().map_err(|error| error.to_string())?).map_err(|error| error.to_string())?;
        return Ok(());
    }

    WebviewWindowBuilder::new(&app, label, WebviewUrl::External(url.parse().map_err(|error| error.to_string())?))
        .title("LinkedIn Prospect Assistant")
        .build()
        .map_err(|error| error.to_string())?;
    Ok(())
}
