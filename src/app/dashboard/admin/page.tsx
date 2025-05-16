'use client'

import React from 'react'

const AgencyDashboard = () = {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Agency Dashbord</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* namage cars section*/}
                <div className="p-4 border rounded shadow">
                    <h2 className="text-xl font-semibold mb-2"> Mange cars</h2>
                    {/*.......*/}  
                </div>
                <div ="p-4 border rounded shadow">
                    <h2 className="text-xl font-semibold mb-2">Reservations</h2>
                    {/*list of resevations*/}
                </div>
            </div>
        </div>
    )
}

export default AgencyDashboard