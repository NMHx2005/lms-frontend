import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Box } from '@mui/material';
import { sharedUploadService } from '@/services/shared/upload.service';
import { toast } from 'react-hot-toast';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
  disabled?: boolean;
  minHeight?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Nhập nội dung...',
  height = 500,
  disabled = false,
  minHeight = 300,
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorChange = (content: string) => {
    onChange(content);
  };

  // Get API key from environment variable or use default
  const apiKey = (import.meta.env.VITE_TINYMCE_API_KEY as string) ||
    'otq3bskid48pnwco0sm0fih6407naykhtx1mzo43szef8yuz';

  return (
    <Box sx={{ width: '100%' }}>
      <Editor
        apiKey={apiKey}
        onInit={(evt: any, editor: any) => {
          editorRef.current = editor;
        }}
        value={value}
        onEditorChange={handleEditorChange}
        disabled={disabled}
        init={{
          height: height,
          min_height: minHeight,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
            'emoticons', 'codesample', 'directionality', 'template', 'pagebreak',
            'nonbreaking', 'hr', 'textcolor', 'colorpicker', 'textpattern',
            'noneditable', 'quickbars', 'accordion', 'toc'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help | link image media codesample | ' +
            'table | code fullscreen | emoticons | accordion toc',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px; line-height:1.6; }',
          placeholder: placeholder,
          branding: false,
          promotion: false,
          // Image upload to Cloudinary
          images_upload_handler: async (blobInfo: any, progress: (percentage: number) => void) => {
            return new Promise(async (resolve, reject) => {
              try {
                // Convert blobInfo to File
                const blob = blobInfo.blob();
                const file = new File([blob], blobInfo.filename(), { type: blob.type });

                // Update progress
                progress(50);

                // Upload to Cloudinary via API
                const response = await sharedUploadService.uploadSingleImage(file);

                // Extract URL from response
                const imageUrl = response?.data?.secureUrl ||
                  response?.data?.url ||
                  response?.url ||
                  response?.secure_url ||
                  '';

                if (imageUrl) {
                  progress(100);
                  resolve(imageUrl);
                } else {
                  throw new Error('Upload response không chứa URL');
                }
              } catch (error: any) {
                console.error('Error uploading image:', error);
                toast.error('Lỗi khi upload ảnh: ' + (error.message || 'Unknown error'));
                reject(error);
              }
            });
          },
          // Media embed
          media_live_embeds: true,
          // Code blocks
          codesample_languages: [
            { text: 'HTML/XML', value: 'markup' },
            { text: 'JavaScript', value: 'javascript' },
            { text: 'CSS', value: 'css' },
            { text: 'PHP', value: 'php' },
            { text: 'Ruby', value: 'ruby' },
            { text: 'Python', value: 'python' },
            { text: 'Java', value: 'java' },
            { text: 'C', value: 'c' },
            { text: 'C#', value: 'csharp' },
            { text: 'C++', value: 'cpp' },
            { text: 'TypeScript', value: 'typescript' },
            { text: 'SQL', value: 'sql' },
            { text: 'JSON', value: 'json' },
            { text: 'Bash', value: 'bash' },
          ],
          // Table options
          table_toolbar: 'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
          table_resize_bars: true,
          table_default_styles: {
            width: '100%',
            borderCollapse: 'collapse'
          },
          // Link options
          link_assume_external_targets: true,
          link_default_target: '_blank',
          // Fullscreen
          fullscreen_native: true,
          // Word count
          wordcount_countregex: /[\w\u2019\'-]+/g,
          // Accessibility
          a11y_advanced_options: true,
        }}
      />
    </Box>
  );
};

export default RichTextEditor;
