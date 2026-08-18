use super::database::{open_connection, RepositoryResult};
use chrono::{DateTime, Utc};
use rusqlite::{params, Row};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Profile {
    pub id: String,
    pub search_id: String,
    pub name: String,
    pub title: Option<String>,
    pub company: Option<String>,
    pub location: Option<String>,
    pub profile_url: String,
    pub photo_url: Option<String>,
    pub visible_button_type: Option<String>,
    pub score: Option<i32>,
    pub badge: Option<String>,
    pub review_status: Option<String>,
    pub favorite: Option<bool>,
    pub note: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateProfilePayload {
    pub search_id: String,
    pub name: String,
    pub title: Option<String>,
    pub company: Option<String>,
    pub location: Option<String>,
    pub profile_url: String,
    pub photo_url: Option<String>,
    pub visible_button_type: Option<String>,
    pub score: Option<i32>,
    pub badge: Option<String>,
    pub review_status: Option<String>,
    pub favorite: Option<bool>,
    pub note: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateProfilePayload {
    pub search_id: String,
    pub name: String,
    pub title: Option<String>,
    pub company: Option<String>,
    pub location: Option<String>,
    pub profile_url: String,
    pub photo_url: Option<String>,
    pub visible_button_type: Option<String>,
    pub score: Option<i32>,
    pub badge: Option<String>,
    pub review_status: Option<String>,
    pub favorite: Option<bool>,
    pub note: Option<String>,
}

pub struct ProfileRepository;

impl ProfileRepository {
    pub fn create(payload: CreateProfilePayload) -> RepositoryResult<Profile> {
        let connection = open_connection()?;
        let id = Uuid::new_v4().to_string();
        let created_at = Utc::now();

        connection.execute(
            "INSERT INTO Profile (id, searchId, name, title, company, location, profileUrl, photoUrl, visibleButtonType, score, badge, reviewStatus, favorite, note, createdAt) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15)",
            params![id, payload.search_id, payload.name, payload.title, payload.company, payload.location, payload.profile_url, payload.photo_url, payload.visible_button_type, payload.score, payload.badge, payload.review_status.unwrap_or_else(|| "pending".to_string()), payload.favorite.unwrap_or(false), payload.note, created_at],
        )?;

        Self::find_by_id(&id)
    }

    pub fn list(search_id: Option<String>) -> RepositoryResult<Vec<Profile>> {
        let connection = open_connection()?;
        if let Some(search_id) = search_id {
            let mut statement = connection.prepare(
                "SELECT id, searchId, name, title, company, location, profileUrl, photoUrl, visibleButtonType, score, badge, reviewStatus, favorite, note, createdAt FROM Profile WHERE searchId = ?1 ORDER BY createdAt DESC",
            )?;
            let rows = statement.query_map(params![search_id], map_profile)?;
            return rows.collect::<Result<Vec<_>, _>>().map_err(Into::into);
        }

        let mut statement = connection.prepare(
            "SELECT id, searchId, name, title, company, location, profileUrl, photoUrl, visibleButtonType, score, badge, reviewStatus, favorite, note, createdAt FROM Profile ORDER BY createdAt DESC",
        )?;
        let rows = statement.query_map([], map_profile)?;
        rows.collect::<Result<Vec<_>, _>>().map_err(Into::into)
    }

    pub fn update(id: &str, payload: UpdateProfilePayload) -> RepositoryResult<Profile> {
        let connection = open_connection()?;
        connection.execute(
            "UPDATE Profile SET searchId = ?1, name = ?2, title = ?3, company = ?4, location = ?5, profileUrl = ?6, photoUrl = ?7, visibleButtonType = ?8, score = ?9, badge = ?10, reviewStatus = ?11, favorite = ?12, note = ?13 WHERE id = ?14",
            params![payload.search_id, payload.name, payload.title, payload.company, payload.location, payload.profile_url, payload.photo_url, payload.visible_button_type, payload.score, payload.badge, payload.review_status.unwrap_or_else(|| "pending".to_string()), payload.favorite.unwrap_or(false), payload.note, id],
        )?;
        Self::find_by_id(id)
    }

    pub fn delete(id: &str) -> RepositoryResult<()> {
        let connection = open_connection()?;
        connection.execute("DELETE FROM Profile WHERE id = ?1", params![id])?;
        Ok(())
    }

    fn find_by_id(id: &str) -> RepositoryResult<Profile> {
        let connection = open_connection()?;
        connection.query_row(
            "SELECT id, searchId, name, title, company, location, profileUrl, photoUrl, visibleButtonType, score, badge, reviewStatus, favorite, note, createdAt FROM Profile WHERE id = ?1",
            params![id],
            map_profile,
        ).map_err(Into::into)
    }
}

fn map_profile(row: &Row<'_>) -> rusqlite::Result<Profile> {
    Ok(Profile {
        id: row.get(0)?,
        search_id: row.get(1)?,
        name: row.get(2)?,
        title: row.get(3)?,
        company: row.get(4)?,
        location: row.get(5)?,
        profile_url: row.get(6)?,
        photo_url: row.get(7)?,
        visible_button_type: row.get(8)?,
        score: row.get(9)?,
        badge: row.get(10)?,
        review_status: row.get(11)?,
        favorite: row.get(12)?,
        note: row.get(13)?,
        created_at: row.get(14)?,
    })
}
