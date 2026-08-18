use rusqlite::Connection;
use std::path::PathBuf;
use thiserror::Error;

pub type RepositoryResult<T> = Result<T, RepositoryError>;

#[derive(Debug, Error)]
pub enum RepositoryError {
    #[error("database error: {0}")]
    Database(#[from] rusqlite::Error),
    #[error("failed to resolve database path")]
    InvalidDatabasePath,
}

pub fn open_connection() -> RepositoryResult<Connection> {
    let database_url =
        std::env::var("DATABASE_URL").unwrap_or_else(|_| "file:./dev.db".to_string());
    let path = database_url
        .strip_prefix("file:")
        .map(PathBuf::from)
        .ok_or(RepositoryError::InvalidDatabasePath)?;

    let connection = Connection::open(path)?;
    run_migrations(&connection)?;
    Ok(connection)
}

fn run_migrations(connection: &Connection) -> RepositoryResult<()> {
    connection.execute_batch(
        r#"
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS Search (
            id TEXT PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            url TEXT NOT NULL,
            cargo TEXT,
            senioridade TEXT,
            location TEXT,
            createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS Profile (
            id TEXT PRIMARY KEY NOT NULL,
            searchId TEXT NOT NULL,
            name TEXT NOT NULL,
            title TEXT,
            company TEXT,
            location TEXT,
            profileUrl TEXT NOT NULL,
            photoUrl TEXT,
            visibleButtonType TEXT,
            score INTEGER,
            badge TEXT,
            reviewStatus TEXT NOT NULL DEFAULT 'pending',
            favorite INTEGER NOT NULL DEFAULT 0,
            note TEXT,
            createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT Profile_searchId_fkey FOREIGN KEY (searchId) REFERENCES Search (id) ON DELETE CASCADE ON UPDATE CASCADE
        );

        CREATE INDEX IF NOT EXISTS Profile_searchId_idx ON Profile(searchId);
        "#,
    )?;
    Ok(())
}
