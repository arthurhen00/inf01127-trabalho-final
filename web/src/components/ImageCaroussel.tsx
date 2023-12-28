'use client'
import React, { Component } from 'react'; 
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from 'react-responsive-carousel'; 
import "../app/explore/override.css"
interface ImageInfo {
	imageUrl: string;
	imageId: string;
}

export default class ImageCaroussel extends Component<{ images: ImageInfo[] }> {
render() {
	const { images } = this.props;
	if (!images || images.length === 0) {
		return <p>No images to display.</p>;
	  }
	return (
		<Carousel 	showIndicators={false} 
					showStatus={false} 
					infiniteLoop={true} 
					showThumbs={false} 
					dynamicHeight = {true}
					useKeyboardArrows = {true}
					className='h-1/2 flex-1 flex flex-col'>
		{images.map(({ imageUrl, imageId }, index) => (
			<div key={index} className='h-full'>
				<img src={imageUrl} alt={`image${index + 1}`} className='object-contain h-full w-auto'/>
			</div>
		))}
		</Carousel>
	);
}
}
