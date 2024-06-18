'use client';

import { useState } from 'react';

export default function Page() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const encode = (data: any) => {
    return Object.keys(data)
      .map(
        (key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]),
      )
      .join('&');
  };

  const handleSubmit = (e: any) => {
    const data = {
      name,
      email,
      message,
    };

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({ 'form-name': 'contact-form', ...data }),
    })
      .then(() => alert('Success!'))
      .catch((error) => alert(error));

    e.preventDefault();
  };
  return (
    <form name="contact-form" method="post" onSubmit={handleSubmit}>
      <input type="hidden" name="form-name" value="contact-form" />
      <p>
        <label>
          Your Name:{' '}
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            name="name"
          />
        </label>
      </p>
      <p>
        <label>
          Your Email:{' '}
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            name="email"
          />
        </label>
      </p>
      <p>
        <label>
          Message:{' '}
          <textarea
            onChange={(e) => setMessage(e.target.value)}
            name="message"
          ></textarea>
        </label>
      </p>
      <p>
        <button type="submit">Send</button>
      </p>
    </form>
  );
}
