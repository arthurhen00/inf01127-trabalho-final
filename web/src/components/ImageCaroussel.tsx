'use client'
import React, { Component } from 'react'; 
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from 'react-responsive-carousel'; 
import "../app/explore/override.css"
interface ImageInfo {
	imageUrl: string;
	imageId: string;
}

interface ImageCarousselProps {
	images: ImageInfo[] | undefined;
	customClassName?: string;
	autoPlay?: boolean
	showArrows?: boolean
  }

const defaultProps: Partial<ImageCarousselProps> = {
	autoPlay: false,
	showArrows: true,
};

export default class ImageCaroussel extends Component<ImageCarousselProps> {
render() {
	const { images, customClassName, autoPlay, showArrows} = this.props;
	if (!images || images.length === 0) {
		return <p>No images to display.</p>;
	}
	return (
		<Carousel 	showIndicators={true} 
					showStatus={false} 
					infiniteLoop={true} 
					showThumbs={false} 
					dynamicHeight = {false}
					useKeyboardArrows = {true}
					autoPlay={autoPlay}
					showArrows={showArrows}
					className='h-full w-full'
					>
		{images.map(({ imageUrl, imageId }, index) => (
			<div key={index} className='h-full w-full'>
				<img src={imageUrl} alt={`image${index + 1}`} className={`${customClassName}`}/>
			</div>
		))}
		</Carousel>
	);
}
}
