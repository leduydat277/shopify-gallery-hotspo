import { DropZone, LegacyStack, Thumbnail, Text } from '@shopify/polaris';
import { NoteIcon } from '@shopify/polaris-icons';
import { useState, useCallback } from 'react';

export const DropZoneImage = ({ onFileUpload }: { onFileUpload: (file: File) => void }) => {
    const [files, setFiles] = useState<File[]>([]);

    const handleDropZoneDrop = useCallback(
        (_dropFiles: File[], acceptedFiles: File[], _rejectedFiles: File[]) => {
            setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
            if (acceptedFiles.length > 0) {
                onFileUpload(acceptedFiles[0]);
            }
        },
        [onFileUpload]
    );

    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

    const fileUpload = !files.length && <DropZone.FileUpload />;
    const uploadedFiles = files.length > 0 && (
        <div style={{ padding: '0' }}>
            <LegacyStack vertical>
                {files.map((file, index) => (
                    <LegacyStack alignment="center" key={index}>
                        <Thumbnail
                            size="small"
                            alt={file.name}
                            source={
                                validImageTypes.includes(file.type)
                                    ? window.URL.createObjectURL(file)
                                    : NoteIcon
                            }
                        />
                        <div>
                            {file.name}{' '}
                            <Text variant="bodySm" as="p">
                                {file.size} bytes
                            </Text>
                        </div>
                    </LegacyStack>
                ))}
            </LegacyStack>
        </div>
    );

    return (
        <DropZone onDrop={handleDropZoneDrop}>
            {uploadedFiles}
            {fileUpload}
        </DropZone>
    );
};
