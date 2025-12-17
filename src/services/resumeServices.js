import api from "@/api";

export const uploadResume = async (userId, file, token) => {
  const formData = new FormData();
  formData.append("file", file);


  return await api.post(`/users/${userId}/resume/extract`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getResumeTemplates = async (userId, token) => {
  const res = await api.get(`/users/${userId}/resume-templates`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const body = res?.data;
  if (!body) return [];

  if (Array.isArray(body)) return body;
  if (Array.isArray(body.templates)) return body.templates;
  if (Array.isArray(body.data)) return body.data;

  return [];
};

export const getResumeTemplateById = async (userId, token, templateId) => {
  return await api.get(`/users/${userId}/resume-templates/${templateId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteResumeTemplate = async (userId, token, templateId) => {
  return await api.delete(`/users/${userId}/resume-templates/${templateId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateResumeTemplate = async (userId, token, templateId, payload) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  return await api.put(`/users/${userId}/resume-templates/${templateId}`, payload, { headers });
};

export const saveResumeTemplates = async (userId, token, templatesPayload) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  return await api.post(`/users/${userId}/resume-templates`, templatesPayload, { headers });
};
