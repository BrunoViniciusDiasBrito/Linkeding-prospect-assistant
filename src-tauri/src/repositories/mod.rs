pub mod database;
pub mod profile_repository;
pub mod search_repository;

pub use database::{RepositoryError, RepositoryResult};
pub use profile_repository::{
    CreateProfilePayload, Profile, ProfileRepository, UpdateProfilePayload,
};
pub use search_repository::{CreateSearchPayload, Search, SearchRepository, UpdateSearchPayload};
// Module placeholder for the initial project structure.
