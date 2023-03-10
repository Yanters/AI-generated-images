import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormField, Loader } from '../components';

import { preview } from '../assets';
import { getRandomPrompt } from '../utils';

const CreatePost = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    prompt: '',
    photo: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.prompt.trim() && formData.photo) {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:${import.meta.env.VITE_SERVER_PORT}/api/v1/posts`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          }
        );

        await response.json();
        navigate('/');
      } catch (error) {
        console.log(error);
        alert('Something went wrong, please try again');
      }
    } else {
      alert('Please enter a prompt and generate an image');
    }
  };
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(formData.prompt);
    setFormData({ ...formData, prompt: randomPrompt });
  };

  const generateImage = async () => {
    if (formData.prompt.trim()) {
      try {
        setIsGenerating(true);
        const response = await fetch(
          `http://localhost:${import.meta.env.VITE_SERVER_PORT}/api/v1/ai`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: formData.prompt }),
          }
        );

        const data = await response.json();
        setFormData({
          ...formData,
          photo: `data:image/jpeg;base64,${data.photo}`,
        });
      } catch (error) {
        console.log(error);
        alert('Something went wrong, please try again');
      } finally {
        setIsGenerating(false);
      }
    } else {
      alert('Please enter a prompt');
    }
  };

  return (
    <section className='max-w-7xl mx-auto'>
      <div>
        <h1 className='font-extrabold text-[#222328] text-[32px]'>Create</h1>
        <p className='mt-2 text-[#666e75] text-[14px] max-w-[500px]'>
          Generate an imaginative image through DALL-E AI and share it with the
          community
        </p>
      </div>
      <form className='mt-16 max-w-3xl' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-5'>
          <FormField
            labelName='Your Name'
            type='text'
            name='name'
            placeholder='Ex., john doe'
            value={formData.name}
            handleChange={handleChange}
          />
          <FormField
            labelName='Prompt'
            type='text'
            name='prompt'
            placeholder='Ex., a cat in a hat'
            value={formData.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />
          <div className='relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center'>
            {formData.photo ? (
              <img
                src={formData.photo}
                alt={formData.prompt}
                className='w-full h-full object-contain'
              />
            ) : (
              <img
                src={preview}
                alt='preview'
                className='w-9/12 h-9/12 object-contain opacity-40'
              />
            )}

            {isGenerating && (
              <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg'>
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className='mt-5 flex gap-5'>
          <button
            type='button'
            onClick={generateImage}
            className=' text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'
          >
            {isGenerating ? 'Generating...' : 'Generate'}
          </button>
        </div>

        <div className='mt-10'>
          <p className='mt-2 text-[#666e75] text-[14px]'>
            ** Once you have created the image you want, you can share it with
            others in the community **
          </p>
          <button
            type='submit'
            className='mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'
          >
            {isLoading ? 'Sharing...' : 'Share with the Community'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
