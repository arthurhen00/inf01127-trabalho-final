'use client'
import React, { Component } from 'react'; 
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from 'react-responsive-carousel'; 
import "../app/explore/override.css"
interface ImageInfo {
	imageUrl: string;
	imageId: string;
}

export default class ImageCaroussel extends Component<{ images: ImageInfo[] | undefined }> {
render() {
	const { images } = this.props;
	if (!images || images.length === 0) {
		return <p>No images to display.</p>;
	}
	return (
		<Carousel 	showIndicators={true} 
					showStatus={false} 
					infiniteLoop={true} 
					showThumbs={false} 
					dynamicHeight = {true}
					useKeyboardArrows = {true}
					>
		{images.map(({ imageUrl, imageId }, index) => (
			<div key={index}>
				<img src={imageUrl} alt={`image${index + 1}`} className='h-[360px] w-[640px] rounded-lg object-cover'/>
			</div>
		))}
		</Carousel>
	);
}
}
