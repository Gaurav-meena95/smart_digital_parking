import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Car, Plus } from 'lucide-react'

function VehicleSelection() {
    const navigate = useNavigate()

    const [vehicles, setVehicles] = useState([])
    const [loading, setLoading] = useState(true)


    const VITE_API_BASE_KEY = import.meta.env.VITE_API_BASE_KEY
    const token = localStorage.getItem('token')
    const refreshToken = localStorage.getItem('refreshToken')
    const header = {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${token}`,
        'x-refresh-token': refreshToken
    }

    useEffect(() => {
        fetchVehicles()
    }, [])

    const fetchVehicles = async () => {
        try {
            const response = await fetch(`${VITE_API_BASE_KEY}/vehicles/all`, {
                method: 'GET',
                headers: header
            })
            const data = await response.json()
            if (response.ok) {
                setVehicles(data.data || [])
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSelectVehicle = (vehicle) => {
        navigate('/confirm-parking', {
            state: {
                selectedVehicle: vehicle
            }
        })
    }

    const handleAddVehicle = () => {
        navigate('/add-vehicle', {
            state: {
                returnTo: '/qr-scanner'
            }
        })
    }

    const handleBack = () => {
        navigate('/qr-scanner')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-indigo-600   text-white">
                <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={handleBack}
                            className="p-3 hover:bg-white/10 rounded-xl transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold">Select Your Vehicle</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">Loading vehicles...</p>
                    </div>
                ) : vehicles.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Car className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No vehicles found</h3>
                        <p className="text-gray-600 mb-8">Add a vehicle to start parking</p>
                        <button
                            onClick={handleAddVehicle}
                            className="bg-indigo-600  text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all font-medium inline-flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Register New Vehicle
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {vehicles.map((vehicle) => (
                            <button
                                key={vehicle.id}
                                onClick={() => handleSelectVehicle(vehicle)}
                                className="w-full bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center">
                                        <Car className="w-8 h-8 text-indigo-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{vehicle.vehicleName}</h3>
                                        <p className="text-gray-600">{vehicle.vehicleNumber}</p>
                                    </div>
                                    <div className="text-indigo-600">
                                        <ArrowLeft className="w-6 h-6 rotate-180" />
                                    </div>
                                </div>
                            </button>
                        ))}

                        <button
                            onClick={handleAddVehicle}
                            className="w-full bg-gray-100 hover:bg-gray-200 rounded-2xl p-6 border-2 border-dashed border-gray-300 transition-all text-left"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
                                    <Plus className="w-8 h-8 text-gray-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-1">Register New Vehicle</h3>
                                    <p className="text-gray-600">Add a new vehicle to your account</p>
                                </div>
                            </div>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
export default VehicleSelection