# AI Document Assistant

An AI-powered document intelligence platform that enables users to upload documents, chat with them using Retrieval-Augmented Generation (RAG), and receive context-aware responses powered by Large Language Models.

This project is being built with a strong focus on **clean architecture, backend engineering, AI integration, and system design** rather than relying on AI frameworks. The goal is to understand and implement every major component of a production-grade RAG pipeline from first principles.

---

## Features

* User Authentication
* Document Upload & Management
* AI-powered Chat Interface
* Multi-chat support per document
* Chat History Persistence
* Retrieval-Augmented Generation (RAG)
* Semantic Search using pgvector
* Azure Blob Storage Integration
* Local LLM inference using Ollama

---

## Tech Stack

### Backend

* Node.js
* TypeScript
* Express.js

### Database

* PostgreSQL
* Prisma ORM
* pgvector

### AI

* Ollama
* Local Embedding Models
* Retrieval-Augmented Generation (RAG)

### Storage

* Azure Blob Storage

---

## System Architecture

```
Client
   │
   ▼
Express API
   │
   ├── Authentication
   ├── Document Management
   ├── Chat Management
   └── AI Services
            │
            ▼
      Retrieval Pipeline
            │
            ▼
      Ollama (LLM)
```

---

## RAG Architecture

### Ingestion Pipeline

```
Document Upload
        │
        ▼
Azure Blob Storage
        │
        ▼
Extract Text
        │
        ▼
Chunk Document
        │
        ▼
Generate Embeddings
        │
        ▼
Store Chunks + Vectors (pgvector)
```

### Retrieval Pipeline

```
User Question
        │
        ▼
Generate Question Embedding
        │
        ▼
Semantic Similarity Search
        │
        ▼
Retrieve Relevant Chunks
        │
        ▼
Prompt Builder
(System Prompt + Context + Chat History + User Question)
        │
        ▼
Ollama
        │
        ▼
AI Response
```

---

## Database Design

```
User
 └── Documents
        └── Chats
               └── Messages

Document
 └── Document Chunks (Embeddings)
```

---

## Project Structure

```
src/
├── controllers/
├── services/
├── routes/
├── middleware/
├── validations/
├── repositories/
├── prisma/
├── types/
├── utils/
└── constants/
```

---

## Design Principles

* Clean Architecture
* Separation of Concerns
* Single Responsibility Principle
* RESTful API Design
* Strong Type Safety with TypeScript
* Modular Service Layer
* Database-first Design
* AI Provider Abstraction
* Scalable RAG Architecture

---

## Roadmap

### Completed

* Authentication
* JWT Authorization
* Document CRUD APIs
* PostgreSQL Integration
* Prisma ORM
* Chat Management
* Ollama Integration

### In Progress

* Document Parsing
* Chunking
* Embedding Generation
* pgvector Integration
* Semantic Retrieval

### Planned

* Azure Blob Storage Integration
* Background Processing
* Streaming AI Responses
* Document Versioning
* Multi-model Support
* Redis Caching
* Observability & Metrics

---

## Learning Objectives

This project is intentionally built without high-level AI frameworks to gain a deep understanding of:

* Backend Architecture
* Retrieval-Augmented Generation (RAG)
* Vector Databases
* Embedding Models
* Semantic Search
* Prompt Engineering
* AI System Design
* Scalable Backend Development

---

## Getting Started

### Clone the repository

```bash
git clone <repository-url>
cd <repository-name>
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env` file and configure:

```
DATABASE_URL=

JWT_SECRET=

OLLAMA_BASE_URL=

OLLAMA_MODEL=

AZURE_STORAGE_CONNECTION_STRING=

AZURE_CONTAINER_NAME=
```

### Run Prisma migrations

```bash
npx prisma migrate dev
```

### Start the server

```bash
npm run dev
```

---

## Vision

The objective of this project is not just to build another AI chatbot, but to design a production-oriented AI backend that demonstrates modern backend engineering, scalable RAG architecture, and AI application development from the ground up.
