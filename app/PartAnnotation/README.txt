You could find the initial mesh files from the released version of ShapeNetCore.
An mapping from synsetoffset to category name could be found in "PartAnnotation/synsetoffset2category.txt"

We also provide an expert verified fully labeled subset for each category, with 
better data quality, given the fact that in some applications segmentation is more desirable than single part labeling.

The folder structure is as below:
	PartAnnotation
		-synsetoffset
			-point_labels
				-partname
					-per-point label for single part
			-points
				-uniformly sampled points from ShapeNetCore models
			-user_annotations
				-partname
					-user provided per-point annotation
			-expert_verified
				-point_labels
					-per-point label for all parts
				-seg_img
					-a visualization of labeling

