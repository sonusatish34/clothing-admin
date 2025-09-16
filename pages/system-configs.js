import Layout from '@/components/Layout/Layout';
import React, { useEffect, useState } from 'react';

const SystemConfig = () => {
    const [settings, setSettings] = useState(null);
    const [formData, setFormData] = useState({
        delivery_base_value: '',
        km_delivery_value: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Fetch current config on load
    useEffect(() => {
        async function fetchData() {
            const myHeaders = new Headers();
            myHeaders.append("accept", "application/json");
            myHeaders.append(
                "Authorization",
                localStorage.getItem(`${localStorage.getItem('user_phone')}_token`)
            );

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            try {
                const response = await fetch("https://ecommstagingapi.tboo.com/admin/other-points-system", requestOptions);
                const result = await response.json();
                setSettings(result);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, []);

    // Set form data after fetch
    useEffect(() => {
        if (settings?.data) {
            setFormData({
                delivery_base_value: settings.data.delivery_base_value ?? '',
                km_delivery_value: settings.data.km_delivery_value ?? ''
            });
        }
    }, [settings]);

    const handleFormChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage('');

        const token = localStorage.getItem(`${localStorage.getItem('user_phone')}_token`);
        const myHeaders = new Headers();
        myHeaders.append("accept", "application/json");
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            app_user_id: 1, // Change if needed
            delivery_base_value: parseFloat(formData.delivery_base_value),
            km_delivery_value: parseFloat(formData.km_delivery_value)
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        try {
            const response = await fetch("https://ecommstagingapi.tboo.com/admin/other-points-system", requestOptions);
            const result = await response.json();

            if (response.ok) {
                setMessage('Settings updated successfully!');
            } else {
                setMessage(result.message || 'Failed to update settings.');
            }
        } catch (error) {
            console.error(error);
            setMessage('An error occurred while updating.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <p className='pb-10 lg:text-3xl font-bold'>System Configs</p>

            {message && (
                <div className="mb-4 p-3 rounded bg-gray-100 text-gray-800">
                    {message}
                </div>
            )}

            <form
                id="delivery-settings-form"
                name="deliverySettings"
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                aria-labelledby="form-heading"
                onSubmit={handleFormSubmit}
            >
                <fieldset className="border border-gray-200 p-4 rounded-lg col-span-2">
                    <legend id="form-heading" className="text-lg font-medium mb-2">
                        Delivery Settings
                    </legend>

                    <div className="flex flex-col gap-2 mb-4">
                        <label htmlFor="deliveryBaseValue" className="font-medium">
                            Delivery Base Value:
                        </label>
                        <input
                            id="deliveryBaseValue"
                            name="delivery_base_value"
                            className="w-fit border px-2 py-1 rounded"
                            type="number"
                            step="0.01"
                            value={formData.delivery_base_value}
                            onChange={(e) => handleFormChange("delivery_base_value", e.target.value)}
                            aria-label="Delivery base value"
                        />
                    </div>

                    <div className="flex flex-col gap-2 mb-4">
                        <label htmlFor="kmDeliveryValue" className="font-medium">
                            Km Delivery Value:
                        </label>
                        <input
                            id="kmDeliveryValue"
                            name="km_delivery_value"
                            className="w-fit border px-2 py-1 rounded"
                            type="number"
                            step="0.01"
                            value={formData.km_delivery_value}
                            onChange={(e) => handleFormChange("km_delivery_value", e.target.value)}
                            aria-label="Kilometer delivery value"
                        />
                    </div>

                    <button
                        type="submit"
                        className={`mt-4 px-4 py-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Submit'}
                    </button>
                </fieldset>
            </form>
        </Layout>
    );
};

export default SystemConfig;
