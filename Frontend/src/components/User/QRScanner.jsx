import { useNavigate } from 'react-router-dom'
import { ArrowLeft,  } from 'lucide-react'

function QRScanner() {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-4xl mx-auto px-6">
                <div className="absolute top-6 left-6 py-8 flex items-center gap-4">
                    <button
                        onClick={() => navigate('/home')}
                        className="p-3 hover:bg-white/10 rounded-lg"
                    >
                        <ArrowLeft className="w-6 h-6 text-white" />
                    </button>
                    <h1 className="text-xl font-medium text-white">Scan QR Code</h1>
                </div>
                <div className="relative flex justify-center py-12">
                    <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden border border-gray-800">
                        <div id="qr-reader" className="w-full h-full" />
                        <div className="absolute inset-0 pointer-events-none border-40 border-black/40">
                            <div className="w-full h-full border-2 border-purple-500 relative">
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-center space-y-8 pb-12">
                    <div>
                        <p className="text-xl font-medium text-white mb-2">Position the QR code</p>
                        <p className="text-gray-400">Scan the QR code on the parking spot</p>
                    </div>
                    <div className="space-y-4 max-w-sm mx-auto">
                        <button
                            onClick={() => navigate('/vehicle-selection')}
                            className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors"
                        >
                            Skip & Enter Manually
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default QRScanner