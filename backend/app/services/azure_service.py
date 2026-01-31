import os
from azure.storage.blob import BlobServiceClient
from fastapi import UploadFile, HTTPException
from backend.app.core.config import AZURE_STORAGE_CONNECTION_STRING, AZURE_CONTAINER_NAME
import uuid

class AzureStorageService:
    def __init__(self):
        if not AZURE_STORAGE_CONNECTION_STRING:
            print("Warning: AZURE_STORAGE_CONNECTION_STRING not set")
            self.blob_service_client = None
        else:
            try:
                self.blob_service_client = BlobServiceClient.from_connection_string(AZURE_STORAGE_CONNECTION_STRING)
                self.container_name = AZURE_CONTAINER_NAME
                self._ensure_container_exists()
            except Exception as e:
                print(f"Error initializing Azure Blob Storage: {e}")
                self.blob_service_client = None

    def _ensure_container_exists(self):
        try:
            container_client = self.blob_service_client.get_container_client(self.container_name)
            if not container_client.exists():
                self.blob_service_client.create_container(self.container_name)
                print(f"Created container: {self.container_name}")
        except Exception as e:
            print(f"Error checking/creating container: {e}")

    async def upload_file(self, file: UploadFile, filename: str = None) -> str:
        if not self.blob_service_client:
            raise HTTPException(status_code=500, detail="Azure Storage not configured")
        
        try:
            if not filename:
                filename = f"{uuid.uuid4()}_{file.filename}"
            
            blob_client = self.blob_service_client.get_blob_client(container=self.container_name, blob=filename)
            
            # Reset file pointer to beginning
            await file.seek(0)
            
            # Upload data
            blob_client.upload_blob(await file.read(), overwrite=True)
            
            # Reset file pointer again for subsequent use if needed
            await file.seek(0)
            
            return blob_client.url
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to upload to Azure: {str(e)}")

    def download_file(self, file_url: str, local_path: str) -> str:
        if not self.blob_service_client:
            raise Exception("Azure Storage not configured")
            
        try:
            # Extract blob name from URL
            # Format: https://<account>.blob.core.windows.net/<container>/<blob_name>
            blob_name = file_url.split('/')[-1]
            
            blob_client = self.blob_service_client.get_blob_client(container=self.container_name, blob=blob_name)
            
            with open(local_path, "wb") as download_file:
                download_file.write(blob_client.download_blob().readall())
                
            return local_path
        except Exception as e:
            raise Exception(f"Failed to download from Azure: {str(e)}")

azure_storage = AzureStorageService()
