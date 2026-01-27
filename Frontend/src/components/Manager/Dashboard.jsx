import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Clock, Ticket, DollarSign, Search, Phone, MapPin, Plus, LogOut, ArrowLeft } from 'lucide-react';


function ManagerDashboard() {


    const VITE_API_BASE_KEY = import.meta.env.VITE_API_BASE_KEY
    const token = localStorage.getItem('token')
    const refreshToken = localStorage.getItem('refreshToken')
    const header = {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${token}`,
        'x-refresh-token': refreshToken
    }

    const [showDrivers, setShowDrivers] = useState(false)
    const [drivers, setDrivers] = useState([])
    const [assignmentId, setAssignmentId] = useState(null)
    const [assignedParkingId, setAssignedParkingId] = useState(null)


    const navigate = useNavigate();
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState({
        activeCars: 0,
        retrieving: 0,
        totalToday: 0,
        revenue: 0
    });
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const filters = ['All', 'Pending Assignment', 'Assigned', 'Parked', 'Completed', 'Retrieved'];

    useEffect(() => {
        fetchDashboardData();
    }, []);

    useEffect(() => {
        fetchAssignments();
    }, [selectedFilter, searchQuery]);

    const fetchDashboardData = async () => {
        try {
            const response = await fetch(`${VITE_API_BASE_KEY}/manager/dashboard`, {
                method: 'GET',
                headers: header

            })
            const data = await response.json()
            console.log('object',data)
            setStats(data);

        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAssignments = async () => {
        try {
            const response = await fetch(`${VITE_API_BASE_KEY}/manager/assignments`, {
                method: 'GET',
                headers: header
            })
            const  data = await response.json() || []

            let filteredData = data
            if (selectedFilter === 'Pending Assignment') {
                filteredData = data.filter(a => a.status === 'pending')
            } else if (selectedFilter === 'Assigned') {
                filteredData = data.filter(a => a.status === 'assigned')
            } else if (selectedFilter === 'Parked') {
                filteredData = data.filter(a => a.status === 'park')
            } else if (selectedFilter === 'Retrieved') {
                filteredData = data.filter(a => a.taskType === 'retrieve')
            } else if (selectedFilter === 'Completed') {
                filteredData = data.filter(a => a.status === 'completed')
            }
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase()
                filteredData = filteredData.filter(a =>
                    a.vehicleId ?.toLowerCase().includes(q) ||
                    a.userId?.toLowerCase().includes(q) ||
                    a.location?.toLowerCase().includes(q)
                )
            }
            setAssignments(filteredData)


        } catch (error) {
            console.error('Error fetching assignments:', error);
            setAssignments([]);
        }
    };

    const handleAddDriver = () => {
        navigate('/manager/add-driver');
    };

    const handleCallCustomer = (phone) => {
        alert('Feature Coming soon')
    };
    const assignDriver = async (driverId) => {
        const response = await fetch(`${VITE_API_BASE_KEY}/manager/reassign-valet`, {
            method: 'PATCH',
            headers: header,
            body: JSON.stringify({
                parkingId: assignmentId,
                driverId: driverId
            })
        })

        const data = await response.json()
        if (!response.ok) {
            alert(data.message)
        }
        setAssignedParkingId(assignmentId)
        setShowDrivers(false)
        setAssignmentId(null)
        fetchAssignments()

    }

    const handleReassignValet = async (id) => {
        try {
            setAssignmentId(id)
            setShowDrivers(true)
            const res = await fetch(`${VITE_API_BASE_KEY}/manager/drivers`, {
                method: "GET",
                headers: header
            })
            const data = await res.json()
            setDrivers(data.drivers)

        } catch (error) {
            console.error('Error reassigning valet:', error);
            alert('Failed to reassign valet');
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleLogout = () => {
        navigate('/login')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-600">Loading...</div>
            </div>
        );
    }
    


    return (
        <>

            <div className={`min-h-screen bg-gray-50 ${showDrivers ? 'blur-2xl pointer-events-none' : ''}`}>
                <div className="bg-indigo-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
                            <div className="flex-1">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Manager Dashboard</h1>
                                <p className="text-lg sm:text-xl text-white/90">Add Driver</p>
                                <p className="text-sm sm:text-base lg:text-lg text-white/80 mt-1">Manage valet assignments and parking operations</p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 self-end lg:self-auto">
                                <button
                                    onClick={handleAddDriver}
                                    className="bg-white/20 hover:bg-white/30 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center gap-2 transition-all font-medium cursor-pointer text-sm sm:text-base"
                                >
                                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Add New Driver
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 sm:p-3 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
                    <div className="my-2">
                        <div className="flex justify-between px-10 gap-4">
                            <div className="flex w-full items-center gap-4 p-4 rounded-lg bg-blue-50">
                                <Car className="text-blue-600" />
                                <div>
                                    <p className="text-sm text-gray-500">Active Cars</p>
                                    <p className="text-xl font-semibold">{stats.activeCars}</p>
                                </div>
                            </div>

                            <div className="flex w-full items-center gap-4 p-4 rounded-lg bg-orange-50">
                                <Clock className="text-orange-600" />
                                <div>
                                    <p className="text-sm text-gray-500">Retrieving</p>
                                    <p className="text-xl font-semibold">{stats.pendingRetrieval}</p>
                                </div>
                            </div>

                            <div className="flex w-full items-center gap-4 p-4 rounded-lg bg-green-50">
                                <Ticket className="text-green-600" />
                                <div>
                                    <p className="text-sm text-gray-500">Total Today</p>
                                    <p className="text-xl font-semibold">{stats.todayEntries}</p>
                                </div>
                            </div>

                            <div className="flex w-full items-center gap-4 p-4 rounded-lg bg-purple-50">
                                <DollarSign className="text-purple-600" />
                                <div>
                                    <p className="text-sm text-gray-500">Revenue</p>
                                    <p className="text-xl font-semibold">
                                        ₹{stats.revenue}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by plate, customer or valet..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                />
                            </div>

                            <div className="flex gap-2 flex-wrap">
                                {filters.map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => setSelectedFilter(filter)}
                                        className={`px-6 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${selectedFilter === filter
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {filter} 
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                        {assignments.length === 0 ? (
                            <div className="lg:col-span-2 bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Car className="w-12 h-12 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No assignments found</h3>
                                <p className="text-gray-600">No assignments match your current criteria</p>
                            </div>
                        ) : (
                            assignments.map((assignment) => (
                                <div key={assignment._id} className={`bg-indigo-50 rounded-2xl p-6 shadow-xl border transition-all
                                ${assignment.status === 'assigned' ? 'bg-amber-50/20 pointer-events-none' : ''}`}>
                                    <div className="flex items-start  justify-between mb-6">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900">{assignment.vehicleName}</h3>
                                            <p className="text-gray-600 mt-1">{assignment.vehicleNumber}</p>
                                        </div>
                                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${assignment.status === 'pending'
                                            ? 'bg-red-50 text-red-700 border border-red-200'
                                            : assignment.status === 'assigned'
                                                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                                : assignment.status === 'parked'
                                                    ? 'bg-orange-100 text-orange-700 border border-orange-200'
                                                    : assignment.status === 'completed'
                                                        ? 'bg-green-100  text-green-700 border border-green-300'
                                                        : 'bg-red-300 text-red-800 border border-red-100'
                                            }`}>
                                            {assignment.status}
                                        </span>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-medium">Customer</span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-900 font-medium">{assignment.customerName}</span>
                                                <button
                                                    onClick={() => handleCallCustomer(assignment.customerPhone)}
                                                    className="p-2 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <Phone className="w-4 h-4 text-indigo-600" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-medium">Task Type</span>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${assignment.taskType === 'Retrieve'
                                                ? 'bg-red-50 text-red-700'
                                                : 'bg-green-50 text-green-700'
                                                }`}>
                                                {assignment.taskType === 'Retrieve' ? 'Vehicle Retrieval' : 'Vehicle parking'}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-medium">Location</span>
                                            <div className="flex items-center gap-2 text-gray-900 font-medium">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                <span>{assignment.location}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-medium">Entry Time</span>
                                            <span className="text-gray-900 font-medium">{assignment.entryTime} • {assignment.duration}</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-medium">Payment</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-900 font-medium">₹{assignment.totalAmount}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-medium">VehicleId</span>
                                            <span className="text-gray-900 font-medium">{assignment.vehicleId}</span>
                                        </div>
                                    </div>

                                    <button
                                        disabled={assignment.status === 'assigned'}
                                        onClick={() => handleReassignValet(assignment._id)}
                                        className={`w-full py-3 rounded-xl font-medium
                                            ${assignment.status === 'assigned'
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : assignment.status === 'completed'
                                                    ? `bg-green-200 blur-sm pointer-events-none`
                                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                            }`}
                                    >
                                        {assignment.status === 'assigned' ? 'Assigned' : assignment.status === 'completed' ? 'completed' : 'Assign Driver'}
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            {
                showDrivers && (
                    <div className={`fixed inset-0 z-50 bg-black/40 flex justify-center items-center`}>
                        <div className="bg-white p-6 rounded w-1/2 max-h-[70vh] flex flex-col">
                            <h1 className='font-bold text-center'>Select Driver</h1>

                            <div className="flex items-center  gap-2 mb-5">
                                <ArrowLeft onClick={() => setShowDrivers(false)} className="cursor-pointer" />
                                <span className="">back</span>
                            </div>

                            <div className="overflow-y-auto space-y-2">
                                {drivers.map(driver => (
                                    <div
                                        key={driver._id}
                                        className={
                                            assignments.find(a => a._id === assignmentId)?.status === 'assigned'
                                                ? 'blur-sm pointer-events-none bg-green-300 p-3 rounded'
                                                : 'flex justify-between items-center p-3 bg-indigo-50 rounded'
                                        }

                                    >
                                        <div>
                                            <h1 className="font-medium">{driver.name}</h1>
                                            <p className="text-sm text-gray-600">{driver.phone}</p>
                                        </div>
                                        <button
                                            onClick={() => assignDriver(driver._id)}
                                            className="bg-indigo-600 text-white px-4 py-1 rounded"
                                        >
                                            {assignments.find(a => a._id === assignmentId)?.status === 'assigned' ? 'Assigned' : 'Assign'}

                                        </button>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>

                )
            }
        </>
    );
}

export default ManagerDashboard