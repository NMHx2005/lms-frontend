import api from '../api';

export const sharedUploadService = {
  // System Health & Info
  async getUploadHealth() {
    const response = await api.get('/upload/health');
    return response.data;
  },

  // Single File Uploads
  async uploadSingleImage(imageFile: File) {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await api.post('/upload/single/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async uploadSingleVideo(videoFile: File) {
    const formData = new FormData();
    formData.append('video', videoFile);

    const response = await api.post('/upload/single/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async uploadSingleDocument(documentFile: File) {
    const formData = new FormData();
    formData.append('document', documentFile);

    const response = await api.post('/upload/single/document', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Multiple File Uploads
  async uploadMultipleImages(imageFiles: File[]) {
    const formData = new FormData();
    imageFiles.forEach(file => formData.append('images', file));

    const response = await api.post('/upload/multiple/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async uploadMultipleDocuments(documentFiles: File[]) {
    const formData = new FormData();
    documentFiles.forEach(file => formData.append('documents', file));

    const response = await api.post('/upload/multiple/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Specialized Uploads
  async uploadProfilePicture(profilePictureFile: File) {
    const formData = new FormData();
    formData.append('profilePicture', profilePictureFile);

    const response = await api.post('/upload/profile-picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async uploadCourseThumbnail(thumbnailFile: File) {
    const formData = new FormData();
    formData.append('thumbnail', thumbnailFile);

    const response = await api.post('/upload/course-thumbnail', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async uploadCourseMaterials(materialFiles: File[]) {
    const formData = new FormData();
    materialFiles.forEach(file => formData.append('materials', file));

    const response = await api.post('/upload/course-materials', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // File Management
  async deleteFile(data: {
    publicId: string;
    resourceType: string;
  }) {
    const response = await api.delete('/upload/file', { data });
    return response.data;
  },

  async getFileInfo(publicId: string, resourceType: string) {
    const response = await api.get(`/upload/file/${publicId}/${resourceType}`);
    return response.data;
  },

  async generateSignedUploadUrl(data: {
    resourceType: string;
    folder: string;
    transformation?: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: string;
    };
  }) {
    const response = await api.post('/upload/signed-url', data);
    return response.data;
  },
};
