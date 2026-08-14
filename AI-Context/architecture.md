# Entities

User
Document
Chat
Message

# Relationships

User -> Documents
Document -> Chats
Chat -> Messages

# File Storage

PDF stored in Azure Blob

Metadata stored in PostgreSQL

# Authentication

JWT

# Authorization

User can only access own documents