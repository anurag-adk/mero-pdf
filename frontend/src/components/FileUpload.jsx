import { useState } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { uploadPDF } from '../services/api';

export default function FileUpload({ onUploadSuccess }) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            await handleFileUpload(files[0]);
        }
    };

    const handleFileSelect = async (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            await handleFileUpload(files[0]);
        }
    };

    const handleFileUpload = async (file) => {
        // Validate file type
        if (!file.name.endsWith('.pdf')) {
            setError('Please upload a PDF file');
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            const response = await uploadPDF(file);
            onUploadSuccess(response);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to upload PDF');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 selection:bg-purple-500/30 selection:text-purple-200">
            <div className="w-full max-w-3xl p-8">
                {/* Hero Section */}
                <div className="text-center mb-12 animate-fadeIn">
                    <div className="inline-flex items-center justify-center p-2 bg-slate-800/50 rounded-full mb-6 border border-slate-700/50 backdrop-blur-sm">
                        <span className="px-3 py-1 text-xs font-semibold text-purple-400 bg-purple-500/10 rounded-full mr-2">NEW</span>
                        <span className="text-slate-400 text-xs pr-2">AI-Powered PDF Analysis</span>
                    </div>

                    <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">
                        Chat with your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 animate-gradient-x">Documents</span>
                    </h1>
                    <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
                        Transform your reading experience. Upload any PDF and instantly get answers, summaries, and insights powered by advanced AI.
                    </p>
                </div>

                {/* Upload Area */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
                        group relative border-2 border-dashed rounded-3xl p-16 text-center transition-all duration-300 ease-out
                        ${isDragging
                            ? 'border-purple-500 bg-purple-500/10 scale-[1.02] shadow-2xl shadow-purple-500/20'
                            : 'border-slate-700/50 bg-slate-800/30 hover:border-purple-500/50 hover:bg-slate-800/50 hover:shadow-xl hover:shadow-purple-500/5'
                        }
                        backdrop-blur-sm
                    `}
                >
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        disabled={isUploading}
                    />

                    <div className="relative z-0">
                        {isUploading ? (
                            <div className="animate-fadeIn">
                                <div className="relative w-20 h-20 mx-auto mb-6">
                                    <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
                                    <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-purple-500 animate-pulse" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Analyzing PDF...</h3>
                                <p className="text-slate-400">Converting your document into knowledge</p>
                            </div>
                        ) : (
                            <div className="transition-transform duration-300 group-hover:-translate-y-2">
                                <div className="relative w-24 h-24 mx-auto mb-8">
                                    <div className={`absolute inset-0 bg-purple-500/20 rounded-full blur-2xl transition-opacity duration-300 ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
                                    <div className="relative bg-slate-800 rounded-2xl p-5 border border-slate-700 shadow-xl group-hover:border-purple-500/30 transition-colors">
                                        <Upload className={`w-full h-full text-purple-400 transition-transform duration-300 ${isDragging ? 'scale-110' : 'group-hover:scale-110'}`} />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-slate-900 p-2 rounded-xl border border-slate-700 shadow-lg">
                                        <FileText className="w-6 h-6 text-pink-400" />
                                    </div>
                                </div>

                                <h3 className="text-3xl font-bold text-white mb-4">
                                    Drag & drop your PDF
                                </h3>
                                <p className="text-slate-400 text-lg mb-8 max-w-sm mx-auto">
                                    or <span className="text-purple-400 font-medium underline underline-offset-4 group-hover:text-purple-300">browse files</span> on your computer
                                </p>

                                <div className="flex items-center justify-center gap-6 text-sm text-slate-500 font-medium">
                                    <span className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                        Fast Processing
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                        Up to 50MB
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
                                        Secure
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 animate-fadeIn">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <p>{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
