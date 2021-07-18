import React, { useState } from 'react'
import axiosInstance from '../../utils/api/axiosInstance';

const initialValue = {
    title: '',
    max_seat: 2,
    set_count: 10,
    rate: 1
}

const createRoom: React.FC = () => {
    const [form, setForm] = useState(initialValue);
    
    const handleChange = (event: { target: { name: any; value: any; }; }) => {
        setForm({...form, [event.target.name]: event.target.value})
    }
    
    const handleSubmit = () => {
        const axios = axiosInstance();
        axios.post('/api/room', form)
    }
    return (
    <>
        <div>RoomCreate</div>
        <form>
            <div>
                <label htmlFor="name">Title：</label>
                <input type="text" name='title' value={form.title} onChange={e => handleChange(e)}/>
            </div>
            <div>
                <label htmlFor="name">Participants：</label>
                <input type="text" name='max_seat' value={form.max_seat} onChange={e => handleChange(e)}/>
            </div>
            <div>
                <label htmlFor="name">Set Count：</label>
                <input type="text" name='set_count' value={form.set_count} onChange={e => handleChange(e)}/>
            </div>
            <div>
                <label htmlFor="name">Rate(x1, x5, x10...)：</label>
                <input type="text" name='rate' value={form.rate} onChange={e => handleChange(e)}/>
            </div>
        </form>
        <button onClick={() => handleSubmit}>Submit</button>
    </>
    )
}
     
export default createRoom