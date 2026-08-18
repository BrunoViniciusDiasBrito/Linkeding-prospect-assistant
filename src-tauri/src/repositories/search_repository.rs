use super::database::{open_connection, RepositoryResult};
use chrono::{DateTime, Utc};
use rusqlite::{params, Row};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Search {
    pub id: String,
    pub name: String,
    pub url: String,
    pub cargo: Option<String>,
    pub senioridade: Option<String>,
    pub location: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateSearchPayload {
    pub name: String,
    pub url: String,
    pub cargo: Option<String>,
    pub senioridade: Option<String>,
    pub location: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateSearchPayload {
    pub name: String,
    pub url: String,
    pub cargo: Option<String>,
    pub senioridade: Option<String>,
    pub location: Option<String>,
}

pub struct SearchRepository;

impl SearchRepository {
    pub fn create(payload: CreateSearchPayload) -> RepositoryResult<Search> {
        let connection = open_connection()?;
        let id = Uuid::new_v4().to_string();
        let created_at = Utc::now();

        connection.execute(
            "INSERT INTO Search (id, name, url, cargo, senioridade, location, createdAt) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
            params![id, payload.name, payload.url, payload.cargo, payload.senioridade, payload.location, created_at],
        )?;

        Self::find_by_id(&id)
    }

    pub fn list() -> RepositoryResult<Vec<Search>> {
        let connection = open_connection()?;
        let mut statement = connection.prepare(
            "SELECT id, name, url, cargo, senioridade, location, createdAt FROM Search ORDER BY createdAt DESC",
        )?;
        let rows = statement.query_map([], map_search)?;
        rows.collect::<Result<Vec<_>, _>>().map_err(Into::into)
    }

    pub fn update(id: &str, payload: UpdateSearchPayload) -> RepositoryResult<Search> {
        let connection = open_connection()?;
        connection.execute(
            "UPDATE Search SET name = ?1, url = ?2, cargo = ?3, senioridade = ?4, location = ?5 WHERE id = ?6",
            params![payload.name, payload.url, payload.cargo, payload.senioridade, payload.location, id],
        )?;
        Self::find_by_id(id)
    }

    pub fn delete(id: &str) -> RepositoryResult<()> {
        let connection = open_connection()?;
        connection.execute("DELETE FROM Search WHERE id = ?1", params![id])?;
        Ok(())
    }

    fn find_by_id(id: &str) -> RepositoryResult<Search> {
        let connection = open_connection()?;
        connection.query_row(
            "SELECT id, name, url, cargo, senioridade, location, createdAt FROM Search WHERE id = ?1",
            params![id],
            map_search,
        ).map_err(Into::into)
    }
}

fn map_search(row: &Row<'_>) -> rusqlite::Result<Search> {
    Ok(Search {
        id: row.get(0)?,
        name: row.get(1)?,
        url: row.get(2)?,
        cargo: row.get(3)?,
        senioridade: row.get(4)?,
        location: row.get(5)?,
        created_at: row.get(6)?,
    })
}
