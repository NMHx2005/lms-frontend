import api from './api';

export const uploadService = {
	health() {
		return api.get('/upload/health').then(r => r.data);
	},
	uploadSingleImage(image: File) {
		const form = new FormData();
		form.append('image', image);
		return api.post('/upload/single/image', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
	},
	uploadSingleVideo(video: File) {
		const form = new FormData();
		form.append('video', video);
		return api.post('/upload/single/video', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
	},
	uploadSingleDocument(document: File) {
		const form = new FormData();
		form.append('document', document);
		return api.post('/upload/single/document', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
	},
	uploadMultipleImages(images: File[]) {
		const form = new FormData();
		images.forEach(f => form.append('images', f));
		return api.post('/upload/multiple/images', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
	},
	uploadMultipleDocuments(documents: File[]) {
		const form = new FormData();
		documents.forEach(f => form.append('documents', f));
		return api.post('/upload/multiple/documents', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
	},
	uploadProfilePicture(file: File) {
		const form = new FormData();
		form.append('profilePicture', file);
		return api.post('/upload/profile-picture', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
	},
	uploadCourseThumbnail(file: File) {
		const form = new FormData();
		form.append('thumbnail', file);
		return api.post('/upload/course-thumbnail', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
	},
	uploadCourseMaterials(files: File[]) {
		const form = new FormData();
		files.forEach(f => form.append('materials', f));
		return api.post('/upload/course-materials', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
	},
	deleteFile(publicId: string, resourceType?: string) {
		return api.delete('/upload/file', { params: { publicId, resourceType } }).then(r => r.data);
	},
	getFileImage(publicId: string) {
		return api.get(`/upload/file/${encodeURIComponent(publicId)}/image`).then(r => r.data);
	},
	createSignedUrl(payload: { resourceType: 'image' | 'video' | 'raw'; uploadPreset?: string }) {
		return api.post('/upload/signed-url', payload).then(r => r.data);
	},
};


