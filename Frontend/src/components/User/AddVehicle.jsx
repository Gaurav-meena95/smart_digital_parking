import React, { useState } from 'react'
import { useNavigate, useLocation, data } from 'react-router-dom'
import { ArrowLeft, Car } from 'lucide-react'

export function AddVehicle() {
    const navigate = useNavigate()
    const location = useLocation()
    const returnTo = location.state?.returnTo || '/home'
    const scannedData = location.state?.scannedData
    const VITE_API_BASE_KEY = import.meta.env.VITE_API_BASE_KEY
    const token = localStorage.getItem('token')
    const refreshToken = localStorage.getItem('refreshToken')
    const header = {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${token}`,
        'x-refresh-token': refreshToken
    }

    const [formData, setFormData] = useState({
        vehicleName: '',
        vehicleNumber: '',
        ownerName: '',
        vehicleType: 'car'
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!formData.vehicleName || !formData.vehicleNumber || !formData.ownerName) {
            setError('Please fill in all required fields')
            return
        }

        setLoading(true)
        try {
            const response = await fetch(`${VITE_API_BASE_KEY}/vehicles/add`, {
                method: 'POST',
                headers: header,
                body: JSON.stringify(formData)
            })
            const data = await response.json()
            if (response.ok) {
                navigate('/vehicle-selection')
            } else {
                alert(data.message)
            }
        } catch (err) {
            setError(err.message || 'Failed to add vehicle')
        } finally {
            setLoading(false)
        }
    }

    const handleBack = () => {
        navigate(-1)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-indigo-600  text-white">
                <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={handleBack}
                            className="p-3 hover:bg-white/10 rounded-xl transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold">Add Vehicle</h1>
                            <p className="text-white/90 mt-2">Register a new vehicle to your account</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Vehicle Name *
                            </label>
                            <input
                                type="text"
                                name="vehicleName"
                                value={formData.vehicleName}
                                onChange={handleInputChange}
                                placeholder="e.g., Toyota Camry"
                                required
                                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Vehicle Number *
                            </label>
                            <input
                                type="text"
                                name="vehicleNumber"
                                value={formData.vehicleNumber}
                                onChange={handleInputChange}
                                placeholder="e.g., MH 12 AB 1234"
                                required
                                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Owner Name *
                            </label>
                            <input
                                type="text"
                                name="ownerName"
                                value={formData.ownerName}
                                onChange={handleInputChange}
                                placeholder="Enter owner name"
                                required
                                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Vehicle Type *
                            </label>
                            <select
                                name="vehicleType"
                                value={formData.vehicleType}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                            >
                                <option value="Car">Car</option>
                                <option value="Bike">Bike</option>
                                <option value="Cycle">Cycle</option>
                                <option value="Scooter">Scooter</option>
                                <option value="Auto">Auto Rickshaw</option>
                                <option value="Jeep">Jeep</option>
                                <option value="Van">Van</option>
                                <option value="Bus">Bus</option>
                                <option value="Truck">Truck</option>
                                <option value="Tractor">Tractor</option>
                                <option value="Ambulance">Ambulance</option>
                                <option value="FireTruck">Fire Truck</option>
                                <option value="PoliceCar">Police Car</option>

                            </select>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-4 rounded-xl hover:shadow-lg transition-all font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Adding Vehicle...' : 'Add Vehicle'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

